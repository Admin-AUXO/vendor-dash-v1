/**
 * UI Primitives
 * 
 * Centralized export for all UI primitive components
 */

// Display components
export { Badge, badgeVariants } from './display/badge';
export type { BadgeProps } from './display/badge';

export { Button, buttonVariants } from './display/button';
export type { ButtonProps } from './display/button';

export { Calendar } from './display/calendar';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './display/dropdown-menu';

export { Progress } from './display/progress';

export { Avatar, AvatarImage, AvatarFallback } from './display/avatar';

// Form components
export { Checkbox } from './form/checkbox';

export { Input } from './form/input';
export type { InputProps } from './form/input';

export { Label } from './form/label';

export { RadioGroup, RadioGroupItem } from './form/radio-group';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './form/select';

export { Switch } from './form/switch';

export { Textarea } from './form/textarea';
export type { TextareaProps } from './form/textarea';

// Layout components
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './layout/card';

export { ScrollArea, ScrollBar } from './layout/scroll-area';

export { Separator } from './layout/separator';

// Navigation components
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './navigation/accordion';

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './navigation/collapsible';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './navigation/tabs';

// Overlay components
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './overlay/alert-dialog';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './overlay/dialog';

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from './overlay/popover';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './overlay/tooltip';

// Utils
export { cn } from './utils';

