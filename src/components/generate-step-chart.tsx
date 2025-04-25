"use client";

import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CartesianGrid, LineChart, XAxis } from "recharts";

type LineChartProps = {
  title: string;
  description: string;
  config: ChartConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | undefined;
  YAxisLabel?: string;
  className?: string;
  children: React.ReactNode;
};

export default function GenerateStepChart({
  title,
  description,
  config,
  data,
  className,
  children,
}: LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className={className}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {children}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
