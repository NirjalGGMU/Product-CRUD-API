"use client";

import { User } from "@/types";

type Props = {
  user: User | null;
  onLogout: () => void;
};

export default function Header({ user, onLogout }: Props) {
  return (
    <header className="header">
      <h2 className="logo">📦 Product Manager</h2>
      <div className="header-right">
        <div className="avatar">{user?.email?.[0]?.toUpperCase() || "?"}</div>
        <span className="header-email">{user?.email}</span>
        <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
