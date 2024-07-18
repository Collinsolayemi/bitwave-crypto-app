import axios from 'axios';

export class CoinbaseService {
  async buyCrypto(userId: string, amount: number, currency: string) {
    try {
      const response = await axios.post(
        'https://api.coinbase.com/v2/accounts/YOUR_ACCOUNT_ID/buys',
        {
          amount: amount.toString(),
          currency: currency,
          payment_method: 'YOUR_PAYMENT_METHOD_ID',
          commit: true,
          quote: true,
        },
        {
          headers: {
            Authorization: `Bearer YOUR_COINBASE_API_KEY`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error buying crypto:', error);
      throw error;
    }
  }

  async sellCrypto(userId: string, amount: number, currency: string) {
    try {
      const response = await axios.post(
        'https://api.coinbase.com/v2/accounts/YOUR_ACCOUNT_ID/sells',
        {
          amount: amount.toString(),
          currency: currency,
          payment_method: 'YOUR_PAYMENT_METHOD_ID',
          commit: true,
          quote: true,
        },
        {
          headers: {
            Authorization: `Bearer YOUR_COINBASE_API_KEY`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error selling crypto:', error);
      throw error;
    }
  }
}
