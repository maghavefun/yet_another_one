import {
  Controller,
  Logger,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LoginDTO } from './auth.dtos';
import { AuthGuard } from './auth.guard';
import { SEVEN_DAYS } from '../../common/constants/common';
import { RegistrationDTO } from './auth.dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOkResponse({
    description: 'User successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Provided data is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
  })
  @ApiBody({
    type: RegistrationDTO,
    description: 'JSON structure with user data for registration',
  })
  async register(
    @Body() userRegistrationDTO: RegistrationDTO,
    @Res() res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.register(userRegistrationDTO);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: SEVEN_DAYS,
    });

    return res.send({
      access_token,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({
    description: 'User successfully logged in',
  })
  @ApiUnauthorizedResponse({ description: 'Unathorized user' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiBody({
    type: LoginDTO,
    description: 'JSON structure with user credentials for login',
  })
  async login(@Body() userLoginDTO: LoginDTO, @Res() res: Response) {
    const user = await this.authService.validateUser(userLoginDTO);
    const jwtPayload = {
      userId: user.id,
    };

    const { access_token, refresh_token } =
      await this.authService.login(jwtPayload);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: SEVEN_DAYS,
    });

    return res.send({
      access_token,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiBearerAuth('jwt')
  @ApiOkResponse({
    description: 'Tocken successfully refreshed',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized user',
  })
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies['refresh_token'];

    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token is not provided');
    }

    const decoded = this.authService.validateToken(refresh_token, 'refresh');

    const payload = {
      userId: decoded?.userId,
    };

    const newTokens = await this.authService.login(payload);

    res.cookie('refresh_token', newTokens.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: SEVEN_DAYS,
    });

    return res.send({
      access_token: newTokens.access_token,
    });
  }
}
