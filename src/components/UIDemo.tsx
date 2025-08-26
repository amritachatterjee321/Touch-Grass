import React from 'react';
import { 
  Button, 
  Badge, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Progress,
  Switch,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui';

export const UIDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">UI Components Demo</h1>
      
      {/* Basic Components */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
          </div>
          
          <div className="flex gap-2">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="input">Input Label</Label>
            <Input id="input" placeholder="Enter text..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textarea">Textarea Label</Label>
            <Textarea id="textarea" placeholder="Enter description..." />
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Option</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="checkbox" />
            <Label htmlFor="checkbox">Accept terms</Label>
          </div>
          
          <div className="space-y-2">
            <Label>Radio Options</Label>
            <RadioGroup defaultValue="option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="switch" />
            <Label htmlFor="switch">Enable notifications</Label>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Progress: 60%</Label>
            <Progress value={60} />
          </div>
          
          <div className="space-y-2">
            <Label>Slider Value</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>Hover for tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Layout Components */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Components</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content for tab 1</TabsContent>
            <TabsContent value="tab2">Content for tab 2</TabsContent>
          </Tabs>
          
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion Item 1</AccordionTrigger>
              <AccordionContent>Content for accordion item 1</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Accordion Item 2</AccordionTrigger>
              <AccordionContent>Content for accordion item 2</AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Alert Components */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>This is a default alert message.</AlertDescription>
          </Alert>
          
          <Alert variant="destructive">
            <AlertTitle>Destructive Alert</AlertTitle>
            <AlertDescription>This is a destructive alert message.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
