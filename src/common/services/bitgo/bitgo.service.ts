import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { GenerateWalletDto } from 'src/auth/dto/generate-wallet.dto';



@Injectable()
export class BitgoService {

    async generateWallet(generateWalletDto: GenerateWalletDto) {

        

    }
}