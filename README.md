# Urban Haven Rentals `frontend`

> Information Systems: **Rental ads board**

Frontend repository by **21321108 Huang Yiyu**

## Tech Stack

This project is built with `Vue3` + `Vite` + `TypeScript` for the ease of
responsive programming and debugging. The atomic CSS library `Tailwind`
is implemented for readability of the codes.

### Disclaimer

To keep this lab work meaningful and make myself more familiar with Vue
programming, I hereby guarantee that:
> All views and components in this project are built without any component
> libraries (such as `Element Plus`) or any help with AI (such as `ChatGPT`).

The dependencies can be seen in `packages.json`.

## Features
<details>
  <summary>Click to view screenshots</summary>
  
  - LEFT: Register view <br />
  - RIGHT: login view with token expired message
  <img src="https://github.com/HoraceHuang-ui/RentalAdsBoard-frontend/assets/67905897/1a597f93-3c3d-406f-b4f3-b16119d1d61a" />

  **Ads list with pagination,** <br />
  - LEFT: Page 1, wide window layout <br />
  - RIGHT: Page 2, narrow window layout 
  <img src="https://github.com/HoraceHuang-ui/RentalAdsBoard-frontend/assets/67905897/6af03431-5f79-4094-9647-a067c7f0538d" />

  **Ad details view,** <br />
  - LEFT: Wide layout <br />
  - RIGHT: Narrow layout
  <img src="https://github.com/HoraceHuang-ui/RentalAdsBoard-frontend/assets/67905897/084e4ed4-f27b-47b4-a661-3fa093d5eece" />

  **Manage ads view,** <br />
  - LEFT: Admin viewing ads posted by herself (with an switch to manage all ads), wide layout <br />
  - RIGHT: Average user viewing ads posted by himself, narrow layout
  <img src="https://github.com/HoraceHuang-ui/RentalAdsBoard-frontend/assets/67905897/2da74438-6fab-4482-bb42-1198809d08a3" />

  **Editing ads view,** <br />
  - LEFT: Admin editing ads posted by others, markdown preview on, attaching 9 images (limit), wide layout <br />
  - RIGHT: Average user posting an ad, markdown preview off, attaching 2 images, narrow layout
  <img src="https://github.com/HoraceHuang-ui/RentalAdsBoard-frontend/assets/67905897/9ca4ce45-8b9d-4ac6-88aa-c89ac4d17a4f" />

  - LEFT: Editing user info with an error message about inconsistent new password & confirm password <br />
  - RIGHT: Attempting to delete his own account, with a warning dialog
  <img src="https://github.com/HoraceHuang-ui/RentalAdsBoard-frontend/assets/67905897/a40321ee-ead7-4ab8-8f2c-e3efed641893">

  **Mouse floating on avatar area,** <br />
  - LEFT: Admin with a "Manage users" option <br />
  - RIGHT: Average user without the option
  <img width="50%" src="https://github.com/HoraceHuang-ui/RentalAdsBoard-frontend/assets/67905897/67af3a26-78fb-4f43-b4cc-adb3b7ccaadc" />

  **Admin managing users (with pagination),** <br />
  - LEFT: Upgrading 'horace'(on the right) to Admin <br />
  - RIGHT: Admin resetting other user's password
  <img src="https://github.com/HoraceHuang-ui/RentalAdsBoard-frontend/assets/67905897/e8b1d0dd-76c8-41d6-81c9-d8c454c6367b" />

</details>

- I have tried my best to make the UI style of this project as close as possible
  to Google's [Material You](https://material.io/blog/announcing-material-you). The
  result turned out to be pretty well, at least to me🥰.
- All **HTTP requests** have a visual feedback, like a **progress bar**, or a **top
  bullet message**, or both. This makes the user feel way better when there is are requests
  ongoing.
- **Login** & **register** with common error handlers. User info include **username**, **password**,
  **avatar**, and **email**.
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
