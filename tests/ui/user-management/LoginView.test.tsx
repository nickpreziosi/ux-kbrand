import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setGuestCookie } from "@/lib/auth/guest-cookie";

const mockReplace = jest.fn();
const mockSignIn = jest.fn();
let authState: { user: { uid: string } | null; loading: boolean } = {
  user: null,
  loading: false,
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

jest.mock("next-intl", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const messages = require("@/public/locales/en.json");
  return {
    useTranslations:
      (namespace: string) =>
      (key: string) => {
        const path = `${namespace}.${key}`;
        const message = path
          .split(".")
          .reduce<unknown>(
            (node, part) => (node as Record<string, unknown>)?.[part],
            messages,
          );
        if (typeof message !== "string") {
          throw new Error(`Missing message: ${path}`);
        }
        return message;
      },
  };
});

jest.mock("@/lib/auth/app-auth-config", () => ({
  getAppAuthConfig: () => ({ name: "K Brand" }),
}));

jest.mock("@/lib/auth/guest-cookie", () => ({
  ...jest.requireActual("@/lib/auth/guest-cookie"),
  setGuestCookie: jest.fn(),
}));

jest.mock("@/contexts/user-management/auth/application/user-management-auth-client-services", () => ({
  signInWithMicrosoftService: {
    signInWithPresenceSession: () => mockSignIn(),
  },
}));

jest.mock("@/ui/user-management/auth/auth-provider", () => ({
  useAuth: () => authState,
}));

jest.mock("@k-lab/components", () => {
  function Button({
    children,
    disabled,
    loading,
    onClick,
    icon,
  }: React.PropsWithChildren<{
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    icon?: React.ReactNode;
  }>) {
    return (
      <button type="button" disabled={disabled || loading} onClick={onClick}>
        {icon}
        {children}
      </button>
    );
  }

  function LoginPage({ children }: React.PropsWithChildren) {
    return <div>{children}</div>;
  }
  LoginPage.FormPanel = ({
    title,
    subtitle,
    children,
  }: React.PropsWithChildren<{ title: string; subtitle?: string }>) => (
    <section>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </section>
  );
  LoginPage.Error = ({ message }: { message: string | null }) =>
    message ? <p role="alert">{message}</p> : null;

  return { Button, LoginPage, cn: (...parts: Array<string | undefined>) => parts.filter(Boolean).join(" ") };
});

import { LoginView } from "@/ui/user-management/views/LoginView";

describe("LoginView", () => {
  const assign = jest.fn();

  beforeEach(() => {
    mockReplace.mockReset();
    mockSignIn.mockReset();
    (setGuestCookie as jest.Mock).mockReset();
    assign.mockReset();
    authState = { user: null, loading: false };
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { assign },
    });
  });

  it("renders Microsoft and Sign in as Guest, with a start icon on Guest", () => {
    render(<LoginView />);

    expect(
      screen.getByRole("button", { name: /sign in with microsoft/i }),
    ).toBeInTheDocument();
    const guest = screen.getByRole("button", { name: /sign in as guest/i });
    expect(guest).toBeInTheDocument();
    expect(guest.querySelector("svg")).not.toBeNull();
  });

  it("hides the Microsoft mark while the button is loading", async () => {
    let finishSignIn!: () => void;
    mockSignIn.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishSignIn = resolve;
        }),
    );
    const user = userEvent.setup();
    render(<LoginView />);

    const microsoft = screen.getByRole("button", {
      name: /sign in with microsoft/i,
    });
    expect(microsoft.querySelector("svg")).not.toBeNull();

    await user.click(microsoft);

    expect(
      screen.getByRole("button", { name: /signing in/i }).querySelector("svg"),
    ).toBeNull();
    finishSignIn();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /sign in with microsoft/i }),
      ).toBeInTheDocument();
    });
  });

  it("sets the guest cookie and hard-navigates home on Guest click", async () => {
    const user = userEvent.setup();
    render(<LoginView />);

    await user.click(screen.getByRole("button", { name: /sign in as guest/i }));

    expect(setGuestCookie).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith("/");
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("disables Guest while Microsoft sign-in is in progress", async () => {
    let finishSignIn!: () => void;
    mockSignIn.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishSignIn = resolve;
        }),
    );
    const user = userEvent.setup();
    render(<LoginView />);

    await user.click(
      screen.getByRole("button", { name: /sign in with microsoft/i }),
    );

    expect(screen.getByRole("button", { name: /sign in as guest/i })).toBeDisabled();
    finishSignIn();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign in as guest/i })).not.toBeDisabled();
    });
  });

  it("hard-navigates to / after a successful Microsoft sign-in", async () => {
    mockSignIn.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<LoginView />);

    await user.click(
      screen.getByRole("button", { name: /sign in with microsoft/i }),
    );

    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith("/");
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("hard-navigates to a safe redirectTo after Microsoft sign-in", async () => {
    mockSignIn.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<LoginView redirectTo="/sales" />);

    await user.click(
      screen.getByRole("button", { name: /sign in with microsoft/i }),
    );

    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith("/sales");
    });
  });
});
