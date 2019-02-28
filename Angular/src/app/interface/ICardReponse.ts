import { ICard } from '../interface/ICard';

export interface ICardResponse {
  success: string;
  cards: ICard[];
  deck_id: string;
  test: string;
}
