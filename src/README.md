# src/

This structure is **deliberately flat**.

```text
src/
├── api/          fetch layer
├── components/   React components
├── hooks/        custom hooks
├── types/        domain types
├── mocks/        MSW handlers (tests only)
├── test/         test utilities
├── App.tsx
├── main.tsx
└── index.css
```

It is not the architecture the application ends up with. Day 5 reorganises
everything here into `app / pages / features / entities / shared`, and that
exercise only works if you have first felt this structure become awkward.

So: put things here for now. When changing "how employee selection works"
means opening four folders, that is the lesson arriving on schedule.

Do not pre-empt it by building the Day 5 structure on Day 1.
