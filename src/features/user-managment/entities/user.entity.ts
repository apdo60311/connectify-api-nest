import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import * as bcrypt from "bcryptjs"

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    dateOfBirth?: Date;

    @Column({ nullable: true })
    profilePhoto: string;

    @Column({ default: UserRole.USER })
    role: string

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    website: string;

    @Column({ default: false })
    isBanned: boolean;

    @Column({ default: false })
    isTwoFactorEnabled: boolean;

    @Column({ nullable: true })
    twoFactorSecret: string;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ nullable: true })
    resetPasswordExpires: Date;

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword() {
        const salt: string = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt);
    }

    constructor(partial: Partial<User>) {
        Object.assign(this, partial)
    }
}

