import { type RepositoryResponse, type UserResponse } from "@/types/github";

export const mapGithubUserToProfile = (user: UserResponse) => {
  return {
    github: user.login,
    name: user.name,
    avatar: user.avatar_url,
    bio: user.bio,
    location: user.location,
    website: user.blog,
    twitter: user.twitter_username,
    followers: user.followers,
    hireable: user.hireable ?? false,
  };
};

export const mapGithubReposisotryToProject = (
  repository: RepositoryResponse
) => {
  return {
    id: repository.id,
    name: repository.name,
    description: repository.description,
    url: repository.html_url,
    star_count: repository.stargazers_count,
    owner_id: repository.owner.id,
    owner_name: repository.owner.login,
    avatar: repository.owner.avatar_url,
    watcher_count: repository.watchers_count,
    published: false,
  };
};
