import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const [user, ] = await this.repository.find({ 
      where: {id: user_id}, 
      relations: ["games"]
    });

    if (!user) {
      throw new Error("User does not exist!");
    }

    console.log("user", user);
    console.log("games", user.games);

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(`
      SELECT * 
      FROM users
      ORDER BY first_name ASC
      `); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(`
    SELECT * 
    FROM users
    WHERE LOWER(first_name) = LOWER('${first_name}') AND LOWER(last_name) = LOWER('${last_name}')
    `); // Complete usando raw query
  }
}
