import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class BlockCypherService {
  constructor() {}

  async generateAddress() {
    try {
      const response = await axios.post(
        `${process.env.BLOCKCYPHER_BASE_URL}/v1/btc/main/addrs?token=${process.env.BLOCKCYPHER_TOKEN}`,
      );
      const data = response.data.address;

      return data;
    } catch (err) {
      console.error('Error generating address:', err);
      throw new Error(err.response ? err.response.data : err.message);
    }
  }

  async generateWallet(name: string) {
    const token = process.env.BLOCKCYPHER_TOKEN;
    const newAddress = await this.generateAddress();

    const payload = {
      token,
      name,
      address: [newAddress],
    };

    try {
      const response = await axios.post(
        `${process.env.BLOCKCYPHER_BASE_URL}/v1/btc/main/wallets?token=${token}`,
        payload,
      );

      return newAddress;
    } catch (err) {
      console.error('Error creating wallet:', err.response.data);
      return err.response ? err.response.data : err.message;
    }
  }

  async getWalletBalance(address: string) {
    try {
      const response = await axios.post(
        `${process.env.BLOCKCYPHER_BASE_URL}v1/btc/main/addrs/${address}/balance`,
      );
      return response.data;
    } catch (err) {
      console.error('Error getting address balance:', err);
      return err.response ? err.response.data : err.message;
    }
  }
}
