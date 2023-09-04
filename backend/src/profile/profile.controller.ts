import {
    Controller,
    Get,
    Param,
    Patch,
    Res,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    NotFoundException,
    BadRequestException
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { ProfileService } from './profile.service';
import { UserService } from 'src/user/user.service';

@Controller('profile')
@ApiTags("Profile Images")
export class ProfileController {
    constructor(private profileService : ProfileService, private userService: UserService) {}
   
    @Get(':filename')
    @ApiParam({name: 'filename', description: 'Profile image asked'})
    @ApiOperation({summary: "Returns an image from the users' profile", description: "Sends an image from the users' profile located on uploads folder."})
    public getImage(@Param("filename") filename: string, @Res() res) {
        if (filename === "null" || filename === "undefined")
          throw new NotFoundException("Not valid null or undefined");
        const filePath = path.join(process.cwd(), 'uploads/' + filename)
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            res.status(404).send('File does not exist.');
          } else {
            res.sendFile(filePath);
          }
        });
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            image: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @ApiOperation({ summary: 'Updates user image profile' })
    async updateImage(@GetUser() user, @UploadedFile() image: Express.Multer.File) {
      try {
        await this.profileService.updateUserAvatar(user.sub, image);
      } catch (error) {
        console.log(error)
        throw new BadRequestException("Image cannot be updated")
      }
    }
}
