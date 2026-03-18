"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { cardService, CardDependencyItem, CardSearchResult } from "@/common/services";
import { useTranslation } from "@/common/provider";

interface CardDependenciesSectionProps {
  cardId: number;
  projectId?: number;
  onOpenCard?: (cardId: number) => void;
  readOnly?: boolean;
}

export function CardDependenciesSection({
  cardId,
  projectId,
  onOpenCard,
  readOnly = false,
}: CardDependenciesSectionProps) {
  const { t } = useTranslation();
  const [dependencies, setDependencies] = useState<CardDependencyItem[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CardSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reloadDependencies = useCallback(() => {
    setLoadingDeps(true);
    cardService
      .getDependencies(cardId)
      .then((res) => setDependencies(res.dependencies))
      .catch(() => {})
      .finally(() => setLoadingDeps(false));
  }, [cardId]);

  useEffect(() => {
    reloadDependencies();
  }, [reloadDependencies]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowResults(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await cardService.searchCards(value.trim(), projectId);
        // Exclude the current card and already-added dependencies
        const depIds = new Set(dependencies.map((d) => d.id));
        setSearchResults(results.filter((r) => r.id !== cardId && !depIds.has(r.id)));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSelectCard = async (result: CardSearchResult) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    try {
      await cardService.addDependency(cardId, result.id);
      reloadDependencies();
    } catch {
      // Dependency already exists or other error — silently ignore
    }
  };

  const handleRemove = async (relatedCardId: number) => {
    await cardService.removeDependency(cardId, relatedCardId);
    reloadDependencies();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {!readOnly && (
      <Box sx={{ position: "relative" }}>
        <TextField
          size="small"
          fullWidth
          placeholder={t("card.dependencies.search")}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          onFocus={() => searchQuery && setShowResults(true)}
          slotProps={{
            input: {
              endAdornment: searching ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} />
                </InputAdornment>
              ) : undefined,
            },
          }}
        />

        {showResults && searchResults.length > 0 && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              maxHeight: 280,
              overflowY: "auto",
            }}
          >
            <List dense disablePadding>
              {searchResults.map((r, idx) => (
                <Box key={r.id}>
                  <ListItem
                    component="button"
                    onClick={() => handleSelectCard(r)}
                    sx={{
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemText
                      primary={`#${r.cardNumber} ${r.title}`}
                      slotProps={{ primary: { variant: "body2" } }}
                    />
                  </ListItem>
                  {idx < searchResults.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        )}

        {showResults && !searching && searchQuery && searchResults.length === 0 && (
          <Paper elevation={4} sx={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, p: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              {t("card.dependencies.noResults")}
            </Typography>
          </Paper>
        )}
      </Box>
      )}

      {loadingDeps ? (
        <Typography variant="body2" color="text.secondary">{t("card.dependencies.loading")}</Typography>
      ) : dependencies.length === 0 ? (
        <Typography variant="body2" color="text.secondary">{t("card.dependencies.none")}</Typography>
      ) : (
        <List dense disablePadding>
          {dependencies.map((dep, idx) => (
            <Box key={dep.id}>
              <ListItem
                disableGutters
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {onOpenCard && (
                      <IconButton
                        size="small"
                        title={t("card.dependencies.open")}
                        onClick={() => onOpenCard(dep.id)}
                      >
                        <span className="material-icons" style={{ fontSize: 18 }}>open_in_new</span>
                      </IconButton>
                    )}
                    {!readOnly && (
                      <IconButton
                        size="small"
                        title={t("card.dependencies.remove")}
                        onClick={() => handleRemove(dep.id)}
                      >
                        <span className="material-icons" style={{ fontSize: 18 }}>close</span>
                      </IconButton>
                    )}
                  </Box>
                }
              >
                <ListItemText
                  primary={`#${dep.cardNumber} ${dep.title}`}
                  slotProps={{ primary: { variant: "body2" } }}
                />
              </ListItem>
              {idx < dependencies.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}
