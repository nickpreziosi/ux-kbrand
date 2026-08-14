import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ar from "@/public/locales/ar.json";
import en from "@/public/locales/en.json";
import es from "@/public/locales/es.json";
import pt from "@/public/locales/pt.json";
import { EMPTY_ASSET_GROUP_FILTER } from "@/contexts/brand-assets/domain/services/asset-filtering";
import { AssetTableToolbar } from "@/ui/brand-assets/components/asset-table-toolbar";

// next-intl (and intl-messageformat under it) are ESM-only, which Jest will
// not load here — so stand in for the hook, but resolve against the real
// en.json and throw on a missing key. A typo'd namespace or an untranslated
// label then fails the suite instead of rendering the key path, which is
// exactly what the browser would show.
jest.mock("next-intl", () => {
  // jest.mock is hoisted above the imports, so the catalog has to be pulled in
  // here rather than referenced from module scope.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const messages = require("@/public/locales/en.json");

  // Enough ICU for this component's copy: named placeholders and a one/other
  // plural. Anything richer belongs in a message-format library, not a mock.
  const format = (message: string, values: Record<string, unknown>) =>
    message
      .replace(
        /\{(\w+), plural, one \{([^}]*)\} other \{([^}]*)\}\}/g,
        (_match, name: string, one: string, other: string) => {
          const count = Number(values[name]);
          return (count === 1 ? one : other).replace(/#/g, String(count));
        },
      )
      .replace(/\{(\w+)\}/g, (_match, name: string) => String(values[name]));

  return {
    useTranslations:
      (namespace: string) =>
      (key: string, values?: Record<string, unknown>) => {
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
        return format(message, values ?? {});
      },
  };
});

jest.mock("@k-lab/components", () => {
  return {
    // Only the props the DOM needs; variant/size stay off the element.
    Button: ({
      children,
      disabled,
      onClick,
      "aria-label": ariaLabel,
    }: React.PropsWithChildren<{
      disabled?: boolean;
      onClick?: () => void;
      "aria-label"?: string;
    }>) => (
      <button type="button" disabled={disabled} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </button>
    ),
    // Stands in for both the search box and the selects: a labelled input, or a
    // native <select> when the caller passes options.
    FloatingLabelInput: ({
      label,
      value,
      onChange,
      selectOptions,
      type,
    }: {
      label: string;
      value: string;
      onChange: (event: { target: { value: string } }) => void;
      selectOptions?: { value: string; label: string }[];
      type?: string;
    }) => {
      const id = `field-${label}`;
      if (selectOptions) {
        return (
          <>
            <label htmlFor={id}>{label}</label>
            <select id={id} value={value} onChange={onChange}>
              {selectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        );
      }
      return (
        <>
          <label htmlFor={id}>{label}</label>
          <input id={id} type={type} value={value} onChange={onChange} />
        </>
      );
    },
  };
});

function renderToolbar(
  overrides: Partial<React.ComponentProps<typeof AssetTableToolbar>> = {},
) {
  const onFilterChange = jest.fn();
  render(
    <AssetTableToolbar
      filter={EMPTY_ASSET_GROUP_FILTER}
      onFilterChange={onFilterChange}
      resultCount={34}
      totalCount={34}
      {...overrides}
    />,
  );
  return { onFilterChange };
}

describe("AssetTableToolbar", () => {
  it("renders real copy for every label — no leftover message keys", () => {
    renderToolbar();

    expect(screen.getByLabelText("Search assets")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Visibility")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear all filters" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/adminAssets\./)).not.toBeInTheDocument();
  });

  it("offers every category plus an unfiltered option", () => {
    renderToolbar();

    const category = screen.getByLabelText("Category") as HTMLSelectElement;
    const labels = Array.from(category.options).map((option) => option.text);
    expect(labels[0]).toBe("All categories");
    expect(labels).toEqual(
      expect.arrayContaining(["Logos", "Brand imagery", "Sales materials"]),
    );
  });

  it("counts the whole catalog when nothing is filtered", () => {
    renderToolbar();
    expect(screen.getByText("34 assets")).toBeInTheDocument();
  });

  it("reports the narrowed count once a filter is on", () => {
    renderToolbar({
      filter: { ...EMPTY_ASSET_GROUP_FILTER, category: "logos" },
      resultCount: 9,
    });
    expect(screen.getByText("Showing 9 of 34 assets")).toBeInTheDocument();
  });

  it("reports the search term back up as it is typed", async () => {
    const user = userEvent.setup();
    const { onFilterChange } = renderToolbar();

    await user.type(screen.getByLabelText("Search assets"), "s");

    expect(onFilterChange).toHaveBeenCalledWith({
      ...EMPTY_ASSET_GROUP_FILTER,
      search: "s",
    });
  });

  it("reports a chosen facet without disturbing the others", async () => {
    const user = userEvent.setup();
    const { onFilterChange } = renderToolbar({
      filter: { ...EMPTY_ASSET_GROUP_FILTER, search: "logo" },
    });

    await user.selectOptions(screen.getByLabelText("Status"), "archived");

    expect(onFilterChange).toHaveBeenCalledWith({
      ...EMPTY_ASSET_GROUP_FILTER,
      search: "logo",
      status: "archived",
    });
  });

  it("only offers Clear once something is filtered, and clears everything", async () => {
    const user = userEvent.setup();
    const { onFilterChange } = renderToolbar({
      filter: { ...EMPTY_ASSET_GROUP_FILTER, search: "logo", status: "archived" },
    });

    const clear = screen.getByRole("button", { name: "Clear all filters" });
    expect(clear).toBeEnabled();

    await user.click(clear);
    expect(onFilterChange).toHaveBeenCalledWith(EMPTY_ASSET_GROUP_FILTER);
  });

  it("disables Clear when no filter is active", () => {
    renderToolbar();
    expect(screen.getByRole("button", { name: "Clear all filters" })).toBeDisabled();
  });
});

describe("filter copy", () => {
  const LOCALES = { en, es, pt, ar };

  it("ships in every locale the portal offers", () => {
    const english: Record<string, string> = en.adminAssets.filters;

    for (const [locale, catalog] of Object.entries(LOCALES)) {
      const filters: Record<string, string> = catalog.adminAssets.filters;

      expect(Object.keys(filters).sort()).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(filters)) {
        expect(typeof value).toBe("string");
        expect(value).not.toBe("");
        // Untranslated copy is the failure this catches — every locale but
        // English should have moved on from the English string.
        if (locale !== "en" && !english[key].includes("{")) {
          expect(value).not.toBe(english[key]);
        }
      }
    }
  });
});
