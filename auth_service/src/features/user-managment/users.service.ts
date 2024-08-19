import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { UserNotFoundException } from 'src/common/errors/auth.exceptions';



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {

  }
  async create(createUserDto: CreateUserDto) {
    const user: User = await this.usersRepository.save(this.usersRepository.create(createUserDto));
    return user;
  }

  async findOne(where: FindOptionsWhere<User>) {
    const user: User = await this.usersRepository.findOneBy(where)
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }


  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update({ id }, updateUserDto,)
  }

  async remove(id: string) {
    return await this.usersRepository.delete({ id });
  }
  async updateSecretKey(userId: string, secret: string): Promise<UpdateResult> {
    return await this.usersRepository.update(
      { id: userId },
      {
        twoFactorSecret: secret,
        isTwoFactorEnabled: true,
      },
    );
  }

  async disable2FA(userId: string): Promise<UpdateResult> {
    return this.usersRepository.update(
      { id: userId },
      {
        twoFactorSecret: null,
        isTwoFactorEnabled: false,
      },
    );
  }
}
