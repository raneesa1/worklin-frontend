// import { Injectable, NgZone } from '@angular/core';

// declare const google: any; // Declare the google variable

// @Injectable({
//   providedIn: 'root',
// })
// export class GoogleAuthService {
//   private clientId =
//     '125784755803-7b4f9n4u5smltbbkejboadp4ejj0t97a.apps.googleusercontent.com'; // Replace with your Google Client ID

//   constructor(private ngZone: NgZone) {
//     this.initializeGoogleAuth();
//   }

//   private initializeGoogleAuth(): void {
//     (window as any).onGoogleScriptLoad = () => {
//       google.accounts.id.initialize({
//         client_id: this.clientId,
//         callback: (response: any) => this.handleCredentialResponse(response),
//       });
//     };
//   }

//   private handleCredentialResponse(response: any): void {
//     this.ngZone.run(() => {
//       const credential = response.credential;
//       console.log('Credential received:', credential);
//       // Perform login or any action you need
//     });
//   }

//   renderButton(element: HTMLElement): void {
//     google.accounts.id.renderButton(element, {
//       theme: 'outline',
//       size: 'large',
//     });
//   }

//   signOut(): void {
//     google.accounts.id.disableAutoSelect();
//   }
// }
