import { Component } from '@angular/core';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    faFacebook = faFacebookF;
    faTwitter = faTwitter;
    faInstagram = faInstagram;
    faYoutube = faYoutube;
    currentDate = new Date();
}
