import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LoginAttemptStatus } from "../enums/login-attempt-status.enum";

@Entity('login_attempts')
export class LoginAttemptsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: LoginAttemptStatus,
        default: LoginAttemptStatus.FAILURE
    })
    attemptStatus: LoginAttemptStatus

    @CreateDateColumn()
    attemptDate: Date;
}

