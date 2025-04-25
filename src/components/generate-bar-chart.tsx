"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { XAxis, CartesianGrid, BarChart, YAxis } from "recharts";

type BarChartProps = {
  title: string;
  description: string;
  config: ChartConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | undefined;
  YAxisLabel?: string;
  className?: string;
  children: React.ReactNode;
};

export default function GenerateBarChart({
  title,
  description,
  config,
  data,
  YAxisLabel,
  className,
  children,
}: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className={className}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              orientation="left"
              label={{
                value: YAxisLabel,
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {children}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
