module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)


type Msg
    = NoMsg


type alias Model =
    Int


view : Model -> Html Msg
view _ =
    section []
        [ nav [] [ h1 [] [ text "Elm App" ], input [ type_ "text" ] [] ]
        , div []
            [ p [] [ text "This is a little Elm app running in our page. It does hot reloading and all that jazz." ]
            , p [] [ text "The End." ]
            ]
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> ( 0, Cmd.none )
        , view = view
        , update = \_ model -> ( model, Cmd.none )
        , subscriptions = \_ -> Sub.none
        }
