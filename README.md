# Urban Haven Rentals `frontend`

> Information Systems: **Rental ads board**

Frontend repository by **21321108 Huang Yiyu**

## Tech Stack

This project is built with `Vue3` + `Vite` + `TypeScript` for the ease of
responsive programming and ease of debugging. The atomic CSS library `Tailwind`
is implemented for the readability of the codes.

### Disclaimer

To keep this lab work meaningful and make myself more familiar with Vue
programming, I hereby ensure that:
> All views and components in this project are built without any component
> libraries (such as `Element Plus`) or any help with AI (such as `ChatGPT`).

The dependencies can be seen in `packages.json`.

## Features

- I have tried my best to make the UI style of this project as close as possible
  to Google's [Material You](https://material.io/blog/announcing-material-you). The
  result turned out to be pretty well, at least to me🥰.
- All **HTTP requests** have a visual feedback, like a **progress bar**, or a **top
  bullet message**, or both. This makes the user feel way better when there is a request
  ongoing.
- **Login** & **register** with common error handlers.
- Board **Homepage** ads list and **pagination**, with a **responsive** layout: 3-col grid
  when wide & 2-col grid when narrow. 6 ads per page.
- **Post** or **edit** an ad in post view, with a **responsive** layout: horizontal when
  wide & vertical when narrow. The ad detail info supports **rich text** via
  `Markdown`. You can preview the compiled **markdown** as you type. Each ad can
  **attach up to 9 images**.
- **Manage** personal ads in a dedicated view. Admin can manage all ads, with a
  switch component allowing to switch view. Each ad can be edited or deleted.
- An admin can **manage all users** in a separate view, unseen to average users.
  In this view, an admin can **upgrade/downgrade** other users to/from admin, or
  **delete a user**, or **reset a user's password** to `12345`. All users are shown
  in a list with **pagination**, 20 per page.
- One can **edit** his **account information** in a separate dialog view, including
  username, email, password, and avatar image.
- One can **log out** or **delete his account**.

## Development

### Dependencies

```shell
npm i
```

### Dev

```shell
npm run dev
```

### Build

```shell
npm run build
```

### ESLint

```shell
npm run lint
```
