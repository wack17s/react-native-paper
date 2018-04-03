/* @flow */

import * as React from 'react';
import { css, styles, include } from 'linaria';
import color from 'color';

import showcaseData from './showcaseData';
import GooglePlayIcon from '../../components/google-play-icon';
import IphoneIcon from '../../components/iphone-icon';

export default class Showcase extends React.Component<{}> {
  render() {
    return (
      <div {...styles(container)}>
        <div {...styles(content)}>
          <h1>Showcase</h1>
          <p>
            {`Here a some examples of real applications that are built using React
          Native Paper. Do you want to share yours? `}
            <a
              href="https://github.com/callstack/react-native-paper/pulls"
              target="_blank"
              rel="noopener noreferrer"
            >
              Just send us a PR!
            </a>
          </p>
        </div>
        <div {...styles(gallery)}>
          {showcaseData.map(data => {
            const tintColor = color(data.color).light() ? '#000000' : '#FFFFFF';
            return (
              <div key={data.image}>
                <div {...styles(imageContainer)}>
                  <img {...styles(image)} src={data.image} alt="" />
                  <div
                    {...styles(info)}
                    style={{ backgroundColor: data.color }}
                  >
                    <h3
                      {...styles(appName)}
                      style={{
                        color: tintColor,
                      }}
                    >
                      {data.name}
                    </h3>
                    <div {...styles(badgeContainer)}>
                      <a
                        href={data.ios || null}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ opacity: data.ios ? '1' : '0.40' }}
                      >
                        <IphoneIcon color={tintColor} />
                      </a>
                      <div {...styles(separation)} />
                      <a
                        href={data.android || null}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ opacity: data.android ? '1' : '0.40' }}
                      >
                        <GooglePlayIcon color={tintColor} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const container = css`
  padding: 24px 0;
  width: 100%;
  overflow-y: auto;
`;

const content = css`
  padding: 0 48px;
  @media (max-width: 680px) {
    padding: 0 16px;
  }
`;

const elevated = css`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const appName = css`
  font-size: 18px;
  @media (min-width: 680px) {
    margin: 0 10px;
  }
`;

const gallery = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 38px;
  @media (max-width: 680px) {
    justify-content: center;
    padding: 8px 16px;
  }
  min-width: 0;
`;

const info = css`
  height: 96px;
  padding: 10px;
  transform: translateY(0);
  transition: 150ms;
`;

const imageContainer = css`
  height: ${480 + 48}px;
  width: auto;
  overflow: hidden;
  margin: 10px;
  @media (max-width: 680px) {
    margin: 10px 0;
  }
  &:hover,
  &:focus {
    .${info} {
      transform: translateY(-48px);
    }
  }
`;

const image = css`
  ${include(elevated)};
  display: block;
  max-height: 480px;
  width: auto;
  .svg {
    fill: red;
  }
`;

const badgeContainer = css`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  padding-left: 12px;
`;

const separation = css`
  padding: 0 5px;
`;
