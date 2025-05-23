"use client";

import React from "react";
import { Finding } from "@/types/finding";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FindingStatus } from "@/types/finding-status";
import { ImageOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Separator } from "./ui/separator";
import FindingAction from "./finding-action";
import useUserClient from "@/hooks/useUserClient";
import { leader } from "@/lib/config";

export default function FindingList({
  findings,
  findingStatuses,
}: {
  findings: Finding[];
  findingStatuses: FindingStatus[];
}) {
  const user = useUserClient();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-2">
      {findings &&
        findings.length >= 1 &&
        findings.map((finding) => (
          <Card className="w-full rounded-lg shadow-md p-0" key={finding.id}>
            <CardContent className="p-2">
              <div className="relative w-full h-80 md:h-48 rounded-md overflow-hidden">
                {finding.findingImages && finding.findingImages.length > 0 ? (
                  <Carousel>
                    <CarouselContent>
                      {finding.findingImages.map((image, index: number) => (
                        <CarouselItem key={image.id}>
                          <Card className="p-0">
                            <CardContent className="aspect-square p-0 rounded-md relative">
                              <div className="absolute z-10 text-xs p-2">
                                <Badge
                                  variant={"secondary"}
                                  className="text-muted-foreground"
                                >
                                  {image.imageStatus}
                                </Badge>
                              </div>
                              <div className="absolute z-10 text-xs p-2 right-0">
                                {`${index + 1} of ${
                                  finding.findingImages?.length
                                }`}
                              </div>
                              <div className="relative w-full h-full overflow-hidden rounded-md">
                                <Image
                                  alt={image.path}
                                  src={image.path}
                                  fill
                                  className="object-cover object-center"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-md gap-2 text-sm">
                    <ImageOff size={20} />
                    No Images
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {finding?.equipment?.id}
                </span>
                <Badge
                  className="text-xs"
                  variant={
                    findingStatuses.find(
                      (status) => status.id === finding.findingStatusId
                    )?.description === "Open"
                      ? "destructive"
                      : "default"
                  }
                >
                  {(findingStatuses &&
                    findingStatuses.find(
                      (status) => status.id === finding.findingStatusId
                    )?.description) ||
                    "Unknown"}
                </Badge>
              </div>
              <p className="mt-3 text-sm h-15 text-muted-foreground truncate text-wrap">
                {finding.description}
              </p>
              <Separator className="mt-3" />
              <div className="flex justify-between mt-3 items-center">
                <p className="text-xs text-muted-foreground">
                  {formatDate(finding.createdAt)}
                </p>
                {(leader.includes(user?.role) ||
                  String(finding?.userId) === user?.id) && (
                  <FindingAction finding={finding} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
