import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "cmdk";
import { Search, Printer, FileText, User, Building, Calculator } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { searchService } from "@/services/search.service";
import { SearchResult } from "@/types/settings";

export const GlobalSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2 || !user?.companyId) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchService.globalSearch(user.companyId, query);
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query, user?.companyId]);

  const handleSelect = (link: string) => {
    setOpen(false);
    setQuery("");
    navigate(link);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 bg-slate-100/50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all w-64"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Pesquisar...</span>
        <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        label="Global Search"
        className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="flex items-center border-b border-slate-100 px-4">
            <Search className="w-5 h-5 text-slate-400" />
            <CommandInput 
              placeholder="Pesquisar impressoras, OS, usuários..." 
              value={query}
              onValueChange={setQuery}
              className="flex-1 h-14 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-base"
            />
          </div>

          <CommandList className="max-h-[400px] overflow-y-auto p-2">
            {loading && query.length >= 2 && (
              <div className="p-4 text-center text-sm text-slate-500">Buscando...</div>
            )}
            
            {!loading && query.length >= 2 && results.length === 0 && (
              <CommandEmpty className="p-8 text-center text-sm text-slate-500">
                Nenhum resultado encontrado para "{query}".
              </CommandEmpty>
            )}

            {results.length > 0 && (
              <CommandGroup heading="Resultados">
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.link)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                      {result.type === 'PRINTER' && <Printer className="w-4 h-4" />}
                      {result.type === 'OS' && <FileText className="w-4 h-4" />}
                      {result.type === 'USER' && <User className="w-4 h-4" />}
                      {result.type === 'COMPANY' && <Building className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{result.title}</span>
                      <span className="text-xs text-slate-500">{result.subtitle}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query.length < 2 && (
              <CommandGroup heading="Acesso Rápido">
                <CommandItem onSelect={() => handleSelect('/dashboard')} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                   <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                     <Calculator className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-bold">Ir para Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect('/printers')} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                   <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                     <Printer className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-bold">Ir para Impressoras</span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
};
