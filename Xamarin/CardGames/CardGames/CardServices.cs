using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CardGames
{
    //Make this a singleton if needed. Right now this will be static
    public class CardServices
    {

        private static string GetCardDeckAPI
        {
            get { return "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"; }
        }

        public static string GetCardListAPIFormat
        { 
            get { return "https://deckofcardsapi.com/api/deck/{0}/draw/?count={1}"; }
        }


        public CardServices()
        {
        }

        public static List<CardRaw> GetCards(int count)
        {
            var client = new HttpClient();
            var deckuri = new Uri(GetCardDeckAPI);

            var response = client.GetStringAsync(deckuri).GetAwaiter().GetResult();

            var data = JsonConvert.DeserializeObject<GetCardDeckResponse>(response);


            var cardapi = new Uri(string.Format(GetCardListAPIFormat, data.deck_id, count));
            var cardresponse = client.GetStringAsync(cardapi).GetAwaiter().GetResult();

            var data1 = JsonConvert.DeserializeObject<GetCardsResponse>(cardresponse);

            return data1.cards;
        }

    }


    public class GetCardDeckResponse
    {
        public string deck_id { get; set; }
        public string success { get; set; }
    }

    public class GetCardsResponse
    {
        public string success { get; set; }
        public List<CardRaw> cards { get; set; }
    }

    public class CardRaw
    {
        public string code { get; set; }
        public string image { get; set; }
    }

}
