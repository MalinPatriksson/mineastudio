"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

type AddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
};

type PhotonFeature = {
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
  };
};

const formatAddress = (feature: PhotonFeature) => {
  const properties = feature.properties ?? {};
  const street = [properties.street ?? properties.name, properties.housenumber].filter(Boolean).join(" ");
  const city = properties.city ?? properties.district ?? properties.state;
  return [street, city, properties.country === "Sverige" ? undefined : properties.country].filter(Boolean).join(", ");
};

export function AddressAutocomplete({ value, onChange }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value.trim().length < 3 || !open) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&lang=sv&limit=5&lat=59.33&lon=18.07`, { signal: controller.signal });
        if (!response.ok) return;
        const result = await response.json() as { features?: PhotonFeature[] };
        const addresses = [...new Set((result.features ?? []).map(formatAddress).filter(Boolean))];
        setSuggestions(addresses);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setSuggestions([]);
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, value]);

  return (
    <label className="field field--wide address-field">
      Adress och stad
      <input
        value={value}
        autoComplete="street-address"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && suggestions.length > 0}
        aria-controls="address-suggestions"
        onChange={(event) => { onChange(event.target.value); setOpen(true); if (event.target.value.trim().length < 3) setSuggestions([]); }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder="Börja skriva gata, nummer och stad"
      />
      {open && suggestions.length > 0 && (
        <div className="address-suggestions" id="address-suggestions" role="listbox" aria-label="Adressförslag">
          {suggestions.map((address) => (
            <button type="button" role="option" aria-selected={value === address} key={address} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(address); setOpen(false); }}>
              <MapPin size={14} /><span>{address}</span>
            </button>
          ))}
          <small className="address-attribution">Adressdata © OpenStreetMap</small>
        </div>
      )}
    </label>
  );
}
