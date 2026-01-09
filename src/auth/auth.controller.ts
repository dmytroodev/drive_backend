import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({
    summary: 'Login with Google',
    description: 'Redirects user to Google OAuth consent screen',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google OAuth',
  })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    
  }

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const token = req.user.access_token;

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}`,
    )

    return req.user;
  }
}