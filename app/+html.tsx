import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// expo-router's default template ships a viewport that still allows pinch
// zoom, and iOS Safari auto-zooms in whenever a text input with
// font-size < 16px gets focus — it never zooms back out on blur, so the
// page stays zoomed until the user manually pinches out. This is the web
// preview of a native-feeling app (the real target platforms are the iOS/
// Android builds), so disabling that auto-zoom trigger outright is simpler
// and more reliable than auditing every input's font-size app-wide.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
