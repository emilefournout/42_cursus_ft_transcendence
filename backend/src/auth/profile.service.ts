import * as jdenticon from 'jdenticon';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { getRandomValues, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class ProfileService {
    private static filepath = "uploads/"

    constructor () {}

    saveImage(file : Express.Multer.File){
        if (file.size > 50_000)
            throw new Error("Max size image violated")
        const fileExtension: string = path.extname(file.originalname)
        if (!fileExtension &&  fileExtension.match(/(jpg|jpeg|png)/g))
            throw new Error("Invalud extension")
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
    
}
