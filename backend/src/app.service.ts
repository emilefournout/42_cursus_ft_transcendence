import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface I42_oauth {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
  secret_valid_until: number;
}

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getToken(code: string): Promise<string> {
    const formData = new FormData()
    formData.append('grant_type', 'authorization_code')
    formData.append('client_id', this.config.get('INTRA_UID'))
    formData.append('client_secret', this.config.get('INTRA_SECRET'))
    formData.append('code', code)
    formData.append('redirect_uri', this.config.get('REDIRECT_URI'))

    return fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then((data: I42_oauth) => data.access_token ?? 'No token')
      // Use the token to get information of the user, because
      .then((token: string) => {
        if (token == 'No token') { return token }

        return fetch('https://api.intra.42.fr/v2/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(response => response.json())
      })
      .catch(error => error)
  }
}
