import * as jdenticon from 'jdenticon';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
    private static filepath = "uploads/"

    constructor (private userService: UserService) {}

    saveImage(file : Express.Multer.File){
        if (file.size > 10_000_000) // 10 MB
            throw new Error("Max size image violated")
        const fileExtension: string = path.extname(file.originalname)
        if (!fileExtension || !/(.jpg|.jpeg|.png)/.test(fileExtension))
            throw new Error(`Invalid extension`)
        const filename = uuidv4() + fileExtension
        fs.writeFileSync(ProfileService.filepath + filename, file.buffer);
        return filename
    }

    generateNewIcon(seed?: string) {
        if (!seed)
            seed = randomBytes(256).toString('hex')
        const size = 128;
        const filename = uuidv4() + ".png"
        const icon = jdenticon.toPng(seed, size);
        fs.writeFileSync(ProfileService.filepath + filename, icon);
        return filename
    }
    
    public async updateUserAvatar(userId: number, image?: Express.Multer.File) {
        let url;

        if (image !== undefined) {
            url = this.saveImage(image);
        } else {
            url = this.generateNewIcon();
        }
        const user = await this.userService.findUserById(userId)
        const previousUrl = user.avatarURL
        await this.userService.updateProfilePhoto(userId, url);
        fs.unlink("uploads/" + previousUrl, (err) => {
            const ignore = err
        });
    }
}