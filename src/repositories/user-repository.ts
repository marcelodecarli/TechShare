import { User } from "../models/User"
import { AppDataSource } from "../config/data-source";
import { Repository } from "typeorm";

export class UserRepository {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    // Method to find a user by ID
    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    // Method to find a user by email
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    // Method to find all users
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // Method to create a new user
    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    // Method to update partial user (using preload)
    async updatePartial(id: number, partialUser: Partial<User>): Promise<User> {
        const user = await this.userRepository.preload({ id, ...partialUser });
    
        if (!user) {
            throw new Error("User not found");
        }
    
        return this.userRepository.save(user);
    }    

    // Method to delete a user by ID
    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
