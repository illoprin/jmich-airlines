import type { Entry } from '../../lib/repository/base.repository'
import type { UserLevel } from '../repository/user';

export interface UserPublicDTO extends Entry {
	firstname: string;
	secondname: string;
	email: string;
	avatarpath: string;
	level: UserLevel;
}