"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-primary-foreground border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="container py-2">
        <div className="flex items-center justify-between md:justify-start">
          <Link
            href="/"
            className="flex items-center mx-4 md:mx-2 mr-8 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo-pluto.png"
              alt="Pluto Logo"
              width={200}
              height={70}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "bg-primary-foreground")}
                    asChild
                  >
                    <Link href="/survey" passHref>
                      Survey
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "bg-primary-foreground")}
                    asChild
                  >
                    <Link href="/result" passHref>
                      Result
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "bg-primary-foreground")}
                    asChild
                  >
                    <Link href="/glossary" passHref>
                      Glossary
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("bg-primary-foreground")}>
                    Weighting
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-secondary">
                    <div className="grid gap-3 p-4 w-[400px] bg-primary-foreground rounded-lg shadow-lg">
                      <NavigationMenuLink
                        className={cn(
                          "flex flex-col w-full select-none rounded-md p-3 leading-none no-underline outline-none transition-colors bg-primary-foreground",
                        )}
                        asChild
                      >
                        <Link href="/weighting" passHref>
                          <div className="text-sm font-medium">Overview</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            General information about the weighting process and methodology
                          </div>
                        </Link>
                      </NavigationMenuLink>

                      <NavigationMenuLink
                        className={cn(
                          "flex flex-col w-full select-none rounded-md p-3 leading-none no-underline outline-none transition-colors bg-primary-foreground",
                        )}
                        asChild
                      >
                        <Link href="/weighting/history" passHref>
                          <div className="text-sm font-medium">History</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Historical data and changes in weighting factors over time
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "bg-primary-foreground")}
                    asChild
                  >
                    <Link href="/feedback" passHref>
                      Feedback
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "bg-primary-foreground")}
                    asChild
                  >
                    <Link href="/news" passHref>
                      News
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 border-t pt-3">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/survey"
                className={cn("px-3 py-2 rounded-md bg-primary-foreground transition-colors")}
                onClick={() => setIsMenuOpen(false)}
              >
                Survey
              </Link>
              <Link
                href="/result"
                className={cn("px-3 py-2 rounded-md bg-primary-foreground transition-colors")}
                onClick={() => setIsMenuOpen(false)}
              >
                Result
              </Link>
              <Link
                href="/glossary"
                className={cn("px-3 py-2 rounded-md bg-primary-foreground transition-colors")}
                onClick={() => setIsMenuOpen(false)}
              >
                Glossary
              </Link>

              <div className="pl-3 font-medium">Weighting</div>
              <Link
                href="/weighting"
                className={cn("px-3 py-2 ml-3 rounded-md bg-primary-foreground transition-colors")}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="font-medium">Overview</div>
                <div className="text-xs text-muted-foreground">
                  General information about the weighting process
                </div>
              </Link>
              <Link
                href="/weighting/history"
                className={cn("px-3 py-2 ml-3 rounded-md bg-primary-foreground transition-colors")}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="font-medium">History</div>
                <div className="text-xs text-muted-foreground">
                  Historical weighting factors over time
                </div>
              </Link>
              <Link
                href="/feedback"
                className={cn("px-3 py-2 rounded-md bg-primary-foreground transition-colors")}
                onClick={() => setIsMenuOpen(false)}
              >
                Feedback
              </Link>
              <Link
                href="/news"
                className={cn("px-3 py-2 rounded-md bg-primary-foreground transition-colors")}
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
