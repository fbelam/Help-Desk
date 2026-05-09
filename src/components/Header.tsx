export function Header() {
  return (
    <>
      {/* TopNavBar (Mobile Only / Header) */}
      <nav className="md:hidden bg-surface dark:bg-surface-dim text-primary dark:text-primary-fixed-dim border-b border-outline-variant/60 shadow-sm flex justify-between items-center w-full px-6 h-16 docked full-width top-0 z-40">
        <div className="font-headline text-2xl font-bold text-primary italic">Sahara Support</div>
        <div className="flex items-center gap-4">
          <button className="hover:bg-primary-fixed/30 transition-colors duration-200 rounded-full p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <span className="material-symbols-outlined text-on-surface">search</span>
          </button>
          <button className="hover:bg-primary-fixed/30 transition-colors duration-200 rounded-full p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <span className="material-symbols-outlined text-on-surface">notifications</span>
          </button>
          <button className="hover:bg-primary-fixed/30 transition-colors duration-200 rounded-full p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <span className="material-symbols-outlined text-on-surface">help_outline</span>
          </button>
          <img alt="User profile" className="h-8 w-8 rounded-full border border-outline-variant/60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTNyXalJNZ1-jI6CcWBEsWTfOOazn1zcF7DfTxWvKVkqDPq47ysQ1UPu-5hACraEI_RoAUiGdVMrv0-uSXBylsETzMAveh5BrDpMAyuXjGlYeUEm_E5NmZ5IuONw8lzHWbg2WBXGJV2LPBwRDFXUXtB9rFq_ll2EyCAd-e8fr5PIUczsh0GkJVeD4K5uV_2fcSzaRiceDesy7-ATdmm0chmXPSXBNnleljNC9DjVgfhqKUuU5CLnGk_z1hH5X2cZ7PhW4gBsirAEQ" />
        </div>
      </nav>
    </>
  );
}
