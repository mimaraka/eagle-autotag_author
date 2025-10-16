# Eagle - Autotag Author Plugin

An [Eagle](https://eagle.cool/) plugin to automatically add author tags to your items based on existing tagged items. This is particularly useful for content saved from platforms like X (formerly Twitter).

<img width="554" height="316" alt="screenshot" src="https://github.com/user-attachments/assets/adcb5d80-297a-4727-a596-f3f2e1f1d897" />

## How It Works

Many of us save inspirational images from artists on X/Twitter. We might create a tag group called "Author" and add tags for each artist (e.g., `@artist_name`). Tagging every single item can be tedious.

This plugin automates the process by learning from your existing tags.

1.  **Scan & Learn**: The plugin scans all your items to find ones that are already tagged with an author tag from your specified "Author" tag group. It builds a map between the author's X/Twitter user ID (extracted from the item's source URL) and their corresponding author tag.
2.  **Autotag**: It then scans all your items again. If it finds an item from an author it has learned about but the item is missing the author tag, the plugin automatically adds it.

For example, if you have one image from `https://twitter.com/some_artist/status/123` tagged with `some_artist`, the plugin will find all other images from `https://twitter.com/some_artist/...` and tag them with `some_artist` as well.

## Installation

1.  Go to the **Releases** page of this repository.
2.  Download the latest `autotag-author.eaglepack` file.
3.  Double-click the downloaded `.eaglepack` file, or drag and drop it into your Eagle window to install.

## Usage

Before you begin, make sure you have done the following:

- Created a **Tag Group** for your authors (e.g., "Author").
- Manually tagged at least **one** item from an X/Twitter author with the correct author tag. The item's URL must be the original tweet URL (e.g., `https://x.com/username/status/12345...`).

### Running the Plugin

1.  In Eagle, navigate to the menu bar and select `Plugin` > `Autotag Author`.
2.  The plugin window will appear.
3.  In the input field, enter the name of your author tag group. It defaults to `Author`.
4.  Click the **"Autotag Author"** button.

The plugin will start processing your library. You can see its progress in the status text below the button. Once finished, a notification will appear telling you how many items were newly tagged.

## For Developers

If you wish to modify this plugin:

1.  Clone the repository.
2.  Open `index.html` in your browser to see the UI.
3.  The main logic is in `js/plugin.js`.
4.  To package your changes for Eagle, you can use the Eagle Plugin CLI or manually zip the contents (`index.html`, `js/`, `plugin.json`) and rename the `.zip` file to `.eaglepack`.

---

This plugin was created to streamline the organization of large asset libraries in Eagle. Enjoy!
