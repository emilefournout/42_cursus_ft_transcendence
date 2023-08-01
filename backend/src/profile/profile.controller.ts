import {
    Controller,
    Get,
    Param,
    Res,
  } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';

@Controller('profile')
@ApiTags("Profile Images")
export class ProfileController {
    @Get(':filename')
    @ApiParam({name: 'filename', description: 'Profile image asked'})
    @ApiOperation({summary: "Returns an image from the users' profile", description: "Sends an image from the users' profile located on uploads folder."})
    public getImage(@Param("filename") filename: string, @Res() res) {
        return res.sendFile(path.join(process.cwd(), 'uploads/' + filename))
    }
}
