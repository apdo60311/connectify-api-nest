import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from 'src/utils/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = new Date().getTime();
    res.on('finish', () => {
      const endTime = new Date().getTime();
      const duration = endTime - startTime;
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    res.on('error', () => {
      const endTime = new Date().getTime();
      const duration = endTime - startTime;
      logger.error(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    })
    next();
  }
}
