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
import { LineChart, XAxis, CartesianGrid, YAxis } from "recharts";

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

export default function GenerateLineChart({
  title,
  description,
  config,
  data,
  YAxisLabel,
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {children}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
