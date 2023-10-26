import Connection from "../db/connection.js";
import User from "../models/user.js";

export default class UserAccessor {
    static async getUser(username) {
        try {
            await Connection.open("users");
            const user = await User.findOne({ username: username });
            return user;
        } catch (e) {
            throw e;
        }
    }

    static async getAllUsers() {
        try {
            await Connection.open("users");
            const users = [];
            for await (const doc of User.find()) {
                users.push(doc);
            }
            // console.log(users);
            return users;
        } catch (e) {
            throw e;
        }
    }

    static async createUser(userDoc) {
        try {
            await Connection.open("users");
            const user = await User.create(userDoc);
            return user;
        } catch (e) {
            throw e;
        }
    }

    static async addFollower(userWhoFollowed, userToFollow) {
        try {
            await Connection.open("users");
            const follower = await UserAccessor.getUser(userWhoFollowed);
            const followee = await UserAccessor.getUser(userToFollow);

            const followerList = follower.following;
            const followeeList = followee.followers;

            if (!followerList.includes(userToFollow)) {
                followerList.push(userToFollow);
                followeeList.push(userWhoFollowed);
            }

            await User.findOneAndUpdate({ username: userWhoFollowed }, { following: followerList });
            await User.findOneAndUpdate({ username: userToFollow }, { followers: followeeList });
        } catch (e) {
            throw e;
        }
    }

    static async removeFollower(userWhoFollowed, userToUnfollow) {
        try {
            await Connection.open("users");
            const follower = await UserAccessor.getUser(userWhoFollowed);
            const followee = await UserAccessor.getUser(userToUnfollow);

            const followerList = follower.following;
            const followeeList = followee.followers;
            if (followeeList.includes(userWhoFollowed)) {
                const updatedFollowerList = followerList.filter(name => name !== userToUnfollow);
                const updatedFolloweeList = followeeList.filter(name => name !== userWhoFollowed);
                await User.findOneAndUpdate({username: userWhoFollowed}, {following: updatedFollowerList});
                await User.findOneAndUpdate({username: userToUnfollow}, {followers: updatedFolloweeList});
            }
        } catch (e) {
            throw e;
        }
    }
}
