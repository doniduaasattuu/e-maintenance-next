import { SessionUser, User } from "@/types/user";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | SessionUser;
}

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ user, className, ...props }, ref) => {
    return (
      <Avatar
        className={`cursor-pointer h-9 w-9 ${className}`}
        ref={ref}
        {...props}
      >
        <AvatarImage
          src={`${user?.image ?? "https://github.com/shadcn.png"} `}
          className="object-cover"
        />
      </Avatar>
    );
  }
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
