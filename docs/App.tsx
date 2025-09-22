import { useMemo, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Combobox,
  ContextMenu,
  DataTable,
  DatePicker,
  Dialog,
  Field,
  Input,
  Pagination,
  Progress,
  Sheet,
  Stack,
  Switch,
  Text,
  ThemePanel,
  Tooltip,
  useCommand,
  useCommandPalette,
  useTheme,
  useToast,
} from "@mosaic";
import type { DataTableColumn } from "@mosaic/components/DataTable";

interface Customer {
  id: string;
  company: string;
  status: "Active" | "Invited" | "Trial" | "Disabled";
  plan: string;
  seats: number;
  lastActive: string;
}

const customers: Customer[] = [
  { id: "acme", company: "Acme Inc.", status: "Active", plan: "Enterprise", seats: 12, lastActive: "2024-10-18" },
  { id: "lumen", company: "Lumen Systems", status: "Trial", plan: "Pro", seats: 5, lastActive: "2024-10-16" },
  { id: "nova", company: "Nova Analytics", status: "Invited", plan: "Starter", seats: 3, lastActive: "2024-10-11" },
  { id: "apex", company: "Apex Studios", status: "Active", plan: "Pro", seats: 7, lastActive: "2024-10-20" },
  { id: "orbital", company: "Orbital Labs", status: "Disabled", plan: "Enterprise", seats: 18, lastActive: "2024-09-24" },
];

const customerColumns: DataTableColumn<Customer>[] = [
  {
    key: "company",
    header: "Company",
    accessor: (row) => row.company,
    sortable: true,
  },
  {
    key: "status",
    header: "Status",
    accessor: (row) => (
      <Badge tone={row.status === "Disabled" ? "danger" : row.status === "Trial" ? "warning" : "success"}>
        {row.status}
      </Badge>
    ),
    sortAccessor: (row) => row.status,
    sortable: true,
  },
  {
    key: "plan",
    header: "Plan",
    accessor: (row) => row.plan,
    sortable: true,
  },
  {
    key: "seats",
    header: "Seats",
    accessor: (row) => row.seats,
    align: "right",
    sortable: true,
  },
  {
    key: "lastActive",
    header: "Last active",
    accessor: (row) => row.lastActive,
    sortAccessor: (row) => new Date(row.lastActive),
    sortable: true,
  },
];

const languageOptions = [
  { value: "react", label: "React", description: "Declarative UI library" },
  { value: "vue", label: "Vue", description: "Progressive framework" },
  { value: "svelte", label: "Svelte", description: "Compiled UI toolkit" },
  { value: "angular", label: "Angular", description: "Batteries included platform" },
  { value: "solid", label: "Solid", description: "Fine-grained reactivity" },
];

const copyPageUrl = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  navigator.clipboard?.writeText(window.location.href).catch(() => {
    /* noop */
  });
};

const contextMenuItems = [
  { id: "copy", label: "Copy link", shortcut: "mod+c", onSelect: copyPageUrl },
  { id: "duplicate", label: "Duplicate", shortcut: "mod+d", onSelect: () => console.log("duplicate") },
  { separator: true },
  { id: "archive", label: "Archive", shortcut: "shift+a", onSelect: () => console.log("archive") },
];

const Hero = ({ onOpenPalette }: { onOpenPalette: () => void }) => (
  <Card tone="primary" hoverable>
    <Stack gap="md">
      <Stack gap="sm">
        <Text variant="headline">Mosaic UI kitchen sink</Text>
        <Text variant="body">
          Explore accessible primitives, keyboard shortcuts, and adaptive theming. Press <Badge tone="neutral">⌘ K</Badge> or use the
          buttons below to try the command palette.
        </Text>
      </Stack>
      <Stack direction="row" gap="sm" wrap>
        <Button onClick={onOpenPalette}>Open palette</Button>
        <Tooltip label="Show a success toast" shortcut="mod+shift+t">
          <Button variant="outline" tone="success" id="toast-trigger">
            Trigger toast
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  </Card>
);

const App = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [framework, setFramework] = useState<string | null>(languageOptions[0]?.value ?? null);
  const [progress, setProgress] = useState(45);
  const themePanelRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { togglePalette } = useCommandPalette();
  const { toggleAppearance } = useTheme();

  const visibleCustomers = useMemo(() => customers.slice((activePage - 1) * 2, (activePage - 1) * 2 + 2), [activePage]);
  const pageCount = Math.max(1, Math.ceil(customers.length / 2));

  const showToast = (tone: "primary" | "success" | "warning" | "danger") => {
    const toneTitles = {
      primary: "Heads up",
      success: "Success",
      warning: "Careful",
      danger: "Action required",
    } as const;
    toast({
      title: toneTitles[tone],
      description: "You can trigger this from the command palette, too.",
      tone,
    });
  };

  useCommand(
    {
      id: "demo.open-dialog",
      title: "Open invite dialog",
      combo: "mod+shift+d",
      run: () => setDialogOpen(true),
      keywords: ["modal", "dialog", "invite"],
    },
    [setDialogOpen],
  );

  useCommand(
    {
      id: "demo.open-sheet",
      title: "Open quick settings sheet",
      combo: "mod+shift+s",
      run: () => setSheetOpen(true),
      keywords: ["sheet", "settings"],
    },
    [setSheetOpen],
  );

  useCommand(
    {
      id: "demo.show-toast",
      title: "Show success toast",
      combo: "mod+shift+t",
      run: () => showToast("success"),
      keywords: ["toast", "notification"],
    },
    [toast],
  );

  useCommand(
    {
      id: "demo.toggle-theme",
      title: "Toggle appearance",
      combo: "mod+shift+l",
      run: () => toggleAppearance(),
      keywords: ["theme", "appearance"],
    },
    [toggleAppearance],
  );

  useCommand(
    {
      id: "demo.focus-theme",
      title: "Scroll to theme settings",
      description: "Jump to accessibility controls",
      run: () => themePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      keywords: ["theme", "settings"],
    },
    [],
  );

  return (
    <div className="app">
      <main className="app-main">
        <Hero onOpenPalette={togglePalette} />

        <section>
          <Text variant="title">Inputs & controls</Text>
          <Card>
            <Stack gap="md">
              <Stack direction="row" gap="md" wrap>
                <Field label="Name">
                  <Input placeholder="Jane Doe" autoComplete="off" />
                </Field>
                <Field label="Project start">
                  <DatePicker />
                </Field>
              </Stack>
              <Stack direction="row" gap="md" wrap>
                <Switch>Share updates automatically</Switch>
                <Checkbox description="Invite this teammate to beta features" defaultChecked>
                  Early access
                </Checkbox>
                <Badge tone="primary">Beta</Badge>
                <Badge tone="neutral" variant="outline">
                  Outline
                </Badge>
              </Stack>
              <Stack direction="row" gap="md" wrap align="center">
                <Combobox
                  options={languageOptions}
                  value={framework}
                  onValueChange={setFramework}
                  placeholder="Search frameworks"
                  id="frameworks"
                />
                <Tooltip label="This action opens a toast" shortcut="mod+shift+t">
                  <Button onClick={() => showToast("primary")} variant="soft">
                    Notify team
                  </Button>
                </Tooltip>
                <Button tone="danger" variant="outline" onClick={() => showToast("danger")}>
                  Delete sample
                </Button>
              </Stack>
            </Stack>
          </Card>
        </section>

        <section>
          <Text variant="title">Avatars & status</Text>
          <Card>
            <Stack direction="row" gap="md" align="center">
              <Avatar name="Samantha Rivers" src="https://i.pravatar.cc/120?img=32" />
              <Avatar name="Alex Chen" size="lg" fallback="AC" />
              <Avatar name="Sophie Alvarez" size="sm" />
            </Stack>
          </Card>
        </section>

        <section>
          <Text variant="title">Tables & data</Text>
          <Card>
            <DataTable<Customer>
              data={visibleCustomers}
              columns={customerColumns}
              rowKey={(row) => row.id}
              caption="Recent customer activity"
              defaultSort={{ columnKey: "company", direction: "asc" }}
            />
            <Stack direction="row" align="center" justify="space-between">
              <Text variant="caption">Page {activePage} of {pageCount}</Text>
              <Pagination page={activePage} pageCount={pageCount} onPageChange={setActivePage} />
            </Stack>
          </Card>
        </section>

        <section>
          <Text variant="title">Progress & feedback</Text>
          <Card>
            <Stack gap="sm">
              <Progress label="Invite campaign" value={progress} showValue />
              <Stack direction="row" gap="sm">
                <Button tone="neutral" variant="outline" onClick={() => setProgress((value) => Math.max(0, value - 10))}>
                  Slow down
                </Button>
                <Button tone="primary" onClick={() => setProgress((value) => Math.min(100, value + 10))}>
                  Speed up
                </Button>
              </Stack>
            </Stack>
          </Card>
        </section>

        <section>
          <Text variant="title">Context menus & toasts</Text>
          <Stack direction="row" gap="md" wrap>
            <ContextMenu items={contextMenuItems}>
              <Card hoverable>
                <Stack gap="sm">
                  <Text variant="title">Right-click me</Text>
                  <Text variant="body">Open the contextual actions menu anywhere in this card.</Text>
                </Stack>
              </Card>
            </ContextMenu>
            <Card>
              <Stack gap="sm">
                <Text variant="title">Notifications</Text>
                <Stack direction="row" gap="sm" wrap>
                  <Button tone="success" variant="soft" onClick={() => showToast("success")}>Success</Button>
                  <Button tone="warning" variant="soft" onClick={() => showToast("warning")}>Warning</Button>
                  <Button tone="danger" variant="soft" onClick={() => showToast("danger")}>Danger</Button>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </section>

        <section>
          <Text variant="title">Overlays</Text>
          <Stack direction="row" gap="sm" wrap>
            <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
            <Button onClick={() => setSheetOpen(true)} variant="outline">
              Open sheet
            </Button>
          </Stack>
        </section>
      </main>
      <aside className="app-sidebar" ref={themePanelRef}>
        <ThemePanel />
      </aside>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Invite teammate"
        description="Send a quick invite and assign a role."
        footer={
          <Stack direction="row" gap="sm">
            <Button variant="ghost" tone="neutral" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              showToast("success");
              setDialogOpen(false);
            }}>
              Send invite
            </Button>
          </Stack>
        }
      >
        <Stack gap="md">
          <Field label="Email">
            <Input type="email" placeholder="name@company.com" />
          </Field>
          <Field label="Role">
            <Combobox
              options={[
                { value: "admin", label: "Administrator" },
                { value: "editor", label: "Editor" },
                { value: "viewer", label: "Viewer" },
              ]}
              defaultValue="editor"
              onValueChange={() => {}}
            />
          </Field>
          <Checkbox defaultChecked>Email teammates about new features</Checkbox>
        </Stack>
      </Dialog>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Quick settings"
        description="Personalize the preview environment."
        side="right"
      >
        <Stack gap="md">
          <Switch defaultChecked>Enable onboarding tips</Switch>
          <Switch>Mute email digests</Switch>
          <Checkbox>Enable experimental API</Checkbox>
          <Stack gap="sm">
            <Text variant="label">System load</Text>
            <Progress value={72} showValue />
          </Stack>
        </Stack>
      </Sheet>
    </div>
  );
};

export default App;
