import {
    Controller,
    Get,
    Param,
    Patch,
    Res,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    NotFoundException
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
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
        return res.sendFile(path.join(process.cwd(), 'uploads/' + filename))
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
        let url: string;
        if (image !== undefined) {
            url = this.profileService.saveImage(image);
        } else {
            url = this.profileService.generateNewIcon();
        }
        await this.userService.updateProfilePhoto(user.sub, url);
    }
}
