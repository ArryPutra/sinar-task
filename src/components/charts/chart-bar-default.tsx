"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartBarProps {
  title: string;
  description?: string;
  data: Record<string, any>[];
  dataKey: string;
  xAxisKey: string;
  label: string;
  color?: string;
  footerTitle?: string;
  footerDescription?: string;
  showFooter?: boolean;
}

export default function ChartBarDefault({
  title,
  description,
  data,
  dataKey,
  xAxisKey,
  label,
  color = "var(--chart-2)",
  footerTitle,
  footerDescription,
  showFooter = false,
}: ChartBarProps) {
  const chartConfig = {
    [dataKey]: {
      label,
      color,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      {showFooter && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footerTitle && (
            <div className="flex items-center gap-2 font-medium">
              {footerTitle}
              <TrendingUp className="h-4 w-4" />
            </div>
          )}

          {footerDescription && (
            <div className="text-muted-foreground">
              {footerDescription}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}