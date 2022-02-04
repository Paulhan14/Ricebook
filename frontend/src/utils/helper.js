export const parseFetchedProfile = (profile) => {
    return {
        id: profile._id,
        accountName: profile.username,
        displayName: profile.displayName,
        phoneNumber: "",
        email: profile.email,
        birthday: profile.dob,
        zipcode: profile.zipcode,
        status: profile.headline,
        avatarLink: profile.avatarLink,
        following: profile.following,
        timestamp: "",
    };
};


