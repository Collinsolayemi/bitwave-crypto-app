// import { Coinbase } from '@coinbase/coinbase-sdk';
// import axios from 'axios';
// import * as dotenv from 'dotenv';
// const path = require('path');

// dotenv.config();

// export class CoinbaseService {
//   private coinbase: Coinbase;
//   private user: any;

//   constructor(apiKeyName: string, apiKeyPrivateKey: string) {
//     this.coinbase = new Coinbase({
//       apiKeyName: apiKeyName,
//       privateKey: apiKeyPrivateKey,
//     });
//   }
//   async getDefaultUser() {
//     const apiKeyName = process.env.MY_COINBASE_API_KEY_NAME;

//     const privateKey = process.env.MY_COINBASE_API_SECRET;

//     const coinbase = new Coinbase({ apiKeyName, privateKey });

//     // Obtain the default user for the API key.
//     const user = await coinbase.getDefaultUser();
//     console.log('user', user);
//     try {
//       this.user = await this.coinbase.getDefaultUser();
//       console.log(user);
//       return this.user;
//     } catch (error) {
//       console.error('Error getting default user:', error);
//       throw error;
//     }
//   }

//   //   async createWallet1() {
//   //     const coinbase = Coinbase.configureFromJson({
//   //       //   filePath: '~/Downloads/cdp_api_key.json',
//   //       filePath: path.join('~', 'Downloads', 'cdp_api_key.json'),
//   //     });
//   //     console.log(
//   //       'Coinbase SDK has been successfully configured with CDP API key.',
//   //     );

//   //     const user = await coinbase.getDefaultUser();
//   //     console.log(user);

//   //     // Create a Wallet for the User.
//   //     const wallet = await user.createWallet();

//   //     // Wallets come with a single default Address, accessible via getDefaultAddress:
//   //     const address = await wallet.getDefaultAddress();
//   //     console.log(address);
//   //   }

//   async createWallet() {
//     try {
//       const coinbase = Coinbase.configureFromJson({
//         filePath: path.join('~', 'Downloads', 'cdp_api_key.json'),
//       });
//       console.log(
//         'Coinbase SDK has been successfully configured with CDP API key.',
//       );
//       const user = await coinbase.getDefaultUser();
//         console.log(user);

//       // Create a Wallet for the User.
//         const wallet = await user.createWallet();

//       // Wallets come with a single default Address, accessible via getDefaultAddress:
//       const address = await wallet.getDefaultAddress();
//       console.log(address);
//     } catch (error) {
//       console.error('Error creating wallet:', error);
//       throw error;
//     }
//   }

//   async fundWallet() {
//     await this.user.getWallet().faucet();
//   }
// }

import { Coinbase } from '@coinbase/coinbase-sdk';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export class CoinbaseService {
  private coinbase: Coinbase;
  private user: any;

  constructor() {
    const apiKeyName = process.env.MY_COINBASE_API_KEY_NAME;
    const privateKey = process.env.MY_COINBASE_API_SECRET;

    if (!apiKeyName || !privateKey) {
      throw new Error(
        'API key name and secret must be provided in environment variables.',
      );
    }

    this.coinbase = new Coinbase({
      apiKeyName,
      privateKey,
    });
  }

  async getDefaultUser() {
    try {
      this.user = await this.coinbase.getDefaultUser();
      console.log('Default user:', this.user);
      return this.user;
    } catch (error) {
      console.error('Error getting default user:', error);
      throw error;
    }
  }

  async createWallet() {
    try {
      const filePath = path.resolve(
        process.env.HOME || process.env.USERPROFILE,
        'Downloads',
        'cdp_api_key.json',
      );
      console.log(`Using configuration file: ${filePath}`);

      const coinbase = Coinbase.configureFromJson({ filePath });
      console.log(
        'Coinbase SDK has been successfully configured with CDP API key.',
      );

      const user = await coinbase.getDefaultUser();
      console.log('Default user:', user);

      const wallet = await user.createWallet();
      console.log('Wallet created:', wallet);

      const address = await wallet.getDefaultAddress();
      console.log('Default address:', address);
    } catch (error) {
      console.error('Error creating wallet:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      console.error('Error message:', error.message);
      console.error('Error HTTP code:', error.httpCode);
      console.error('Error API code:', error.apiCode);
      console.error('Error API message:', error.apiMessage);
      throw error;
    }
  }
}


