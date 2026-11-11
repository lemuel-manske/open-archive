import { useTranslation } from '@lemuel-manske/i18n/react';
import {
  ART_ARCHIVE,
  ART_CAPTION,
  ART_CATEGORY,
  ART_COPY,
  ART_MEMORY,
  ART_PRESERVE,
  ART_SPECIMEN,
} from '../../i18n/message-ids';

import styles from './ArchiveArtwork.module.css';

function ArchiveArtwork() {
  const { t } = useTranslation();

  return (
    <div className={styles.artwork} aria-hidden="true">
      <svg viewBox="0 0 600 620" fill="none" focusable="false">
        <path
          d="M30 90H570M30 530H570M90 30V590M510 30V590"
          stroke="currentColor"
          strokeOpacity=".14"
          strokeDasharray="2 7"
        />
        <g transform="rotate(9 340 275)">
          <path d="M175 60H535V480H175Z" fill="#E2E3D6" stroke="#92998B" />
          <path d="M175 60H535V98H175Z" fill="#CFD5C7" stroke="#92998B" />
          <circle cx="195" cy="79" r="3" fill="#52695D" />
          <circle cx="208" cy="79" r="3" stroke="#52695D" />
          <path d="M230 79H506M203 129H405M203 141H470" stroke="#52695D" />
          <text x="202" y="196" className={styles.backTitle}>
            {t(ART_ARCHIVE)}
          </text>
          <path d="M202 218H505M202 230H505" stroke="#92998B" />
          <rect x="203" y="253" width="133" height="113" stroke="#92998B" />
          <path
            d="M350 256H504M350 270H504M350 284H504M350 298H478M350 326H504M350 340H489M202 389H504M202 403H504M202 417H440"
            stroke="#92998B"
          />
        </g>
        <g className={styles.front}>
          <g transform="rotate(-8 270 330)">
            <path d="M58 135H440V554L429 558L416 553L401 558H58Z" fill="#FBF9F1" stroke="#92998B" />
            <path d="M78 156H420V532H78Z" stroke="#D1D2C4" />
            <text x="96" y="187" className={styles.micro}>
              {t(ART_CATEGORY)}
            </text>
            <path d="M96 203H402" stroke="#254F46" />
            <text x="93" y="268" className={styles.frontTitle}>
              {t(ART_MEMORY)}
            </text>
            <text x="96" y="294" className={styles.micro}>
              {t(ART_COPY)}
            </text>
            <path d="M96 312H402" stroke="#92998B" />
            <path
              d="M96 334H234M96 346H234M96 358H214M96 382H234M96 394H234M96 406H234M96 418H203M96 442H234M96 454H234M96 466H219"
              stroke="#B4B8A8"
            />
            <rect x="255" y="333" width="147" height="136" fill="#E8EBE0" />
            <path d="M264 447L296 393L324 425L354 365L395 447Z" stroke="#52695D" />
            <circle cx="285" cy="359" r="10" stroke="#52695D" />
            <path d="M96 489H402M96 498H326" stroke="#B4B8A8" />
          </g>
        </g>
        <g transform="rotate(-16 425 460)" className={styles.stamp}>
          <rect x="323" y="421" width="215" height="64" stroke="#254F46" strokeWidth="2" />
          <rect x="329" y="427" width="203" height="52" stroke="#254F46" strokeWidth=".7" />
          <text x="430" y="461" textAnchor="middle" className={styles.stampText}>
            {t(ART_PRESERVE)}
          </text>
        </g>
        <path d="M40 558H136M460 120H558M510 72V110M491 91H529" stroke="#254F46" />
        <text x="48" y="594" className={styles.caption}>
          {t(ART_CAPTION)}
        </text>
      </svg>
      <span className={styles.specimen}>{t(ART_SPECIMEN)}</span>
    </div>
  );
}

export { ArchiveArtwork };
