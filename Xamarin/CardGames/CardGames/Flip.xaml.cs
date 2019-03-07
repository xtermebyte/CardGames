using System;
using System.Collections.Generic;
using System.Windows.Input;
using DLToolkit.Forms.Controls;
using Xamarin.Forms;
using System.Linq;
using System.Timers;

namespace CardGames
{
    public partial class Flip : ContentPage
    {
        public List<Card> CardList { get; set; }
        private Random rand = new Random();
        private List<string> selectedCodes = new List<string>();


        public Flip()
        {
            InitializeComponent();
            HeaderLogo.Source = ImageSource.FromResource("CardGames.Images.CardGamesSmall.png");
            InitCardList();
            InitEvents();
            PopulateFlowView();
        }

        private void InitCardList()
        {
            var cardData = CardServices.GetCards(8);

            var cardListRaw = new List<Card>();
            cardData.ForEach(card => {
                cardListRaw.Add(new Card { ID=rand.Next(), Code = card.code, Rotation="0", Opacity="1", ImageURL = card.image, ShowImageURL="card.jpg" });
                cardListRaw.Add(new Card { ID=rand.Next(), Code = card.code, Rotation="0", Opacity="1", ImageURL = card.image, ShowImageURL="card.jpg" });
            });

            Random rd = new Random();
            CardList = cardListRaw.OrderBy(x => rd.NextDouble()).ToList();
        }

        private void PopulateFlowView()
        {
            cardListView.FlowItemsSource = null;

            var cardListData = new List<Card>();
            CardList.ForEach(card => {
                cardListData.Add(new Card { ID = card.ID, Rotation=card.Rotation, Opacity=card.Opacity, Code = card.Code, ImageURL = card.ImageURL, ShowImageURL = card.ShowImageURL });
            });

            cardListView.FlowItemsSource = cardListData;
        }

        private void InitEvents()
        {
            cardListView.FlowItemTapped += OnItemTapped;
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            MessagingCenter.Subscribe<App>((App)Xamarin.Forms.Application.Current, "ImagesSelected", (s) =>
            {
                PopulateFlowView();
            });

        }

        private void Validate()
        {
            if (selectedCodes.Count > 1)
            {
                if (selectedCodes[0] == selectedCodes[1])
                {
                    CardList.ForEach(card => {
                        if (selectedCodes[0] == card.Code || selectedCodes[1] == card.Code)
                            card.Opacity = "0.5";
                    });
                }
                else
                {

                    CardList.ForEach(card =>
                    {
                        if (selectedCodes[0] == card.Code || selectedCodes[1] == card.Code)
                            card.ShowImageURL = "card.jpg";
                    });
                }
                
                MessagingCenter.Send<App>((App)Xamarin.Forms.Application.Current, "ImagesSelected");
                selectedCodes = new List<string>();
                //PopulateFlowView();
            }
        }

        private void startTimerOnce()
        {
            Timer tmrOnce = new Timer();
            tmrOnce.Elapsed += TmrOnce_Elapsed;
            tmrOnce.Interval = 1000;
            tmrOnce.Start();
        }

        void TmrOnce_Elapsed(object sender, ElapsedEventArgs e)
        {
            ((Timer)sender).Dispose();

            Device.BeginInvokeOnMainThread(() => Validate());
        }

        private void OnItemTapped(object sender, ItemTappedEventArgs e)
        {
            var selectedItem = (Card)e.Item;

            if (selectedItem.ImageURL == selectedItem.ShowImageURL || selectedCodes.Count > 1)
                return;

            selectedCodes.Add(selectedItem.Code);
            CardList.ForEach(card => {
                if (selectedItem.ID == card.ID)
                {
                    card.Rotation = "360";
                    card.ShowImageURL = card.ImageURL;
                }
            });

            MessagingCenter.Send<App>((App)Xamarin.Forms.Application.Current, "ImagesSelected");
            //PopulateFlowView();
            startTimerOnce();
        }
    }

    public class Card
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string ImageURL { get; set; }
        public string ShowImageURL { get; set; }
        public string Opacity { get; set; }
        public string Rotation { get; set; }
    }
}
