from django import forms
from .models import Answer, Choice, Enrollment, Review

class AnswerForm(forms.ModelForm):
    selected_choice = forms.ModelChoiceField(
        queryset=Choice.objects.none(), 
        widget=forms.RadioSelect,
        required=False
    )
    text = forms.CharField(required=False, widget=forms.Textarea(attrs={'rows': 2}))

    class Meta:
        model = Answer
        fields = ['selected_choice', 'text']

    def __init__(self, *args, **kwargs):
        question = kwargs.pop('question', None)
        super().__init__(*args, **kwargs)
        if question:
            if question.is_multiple_choice:
                self.fields['selected_choice'].queryset = question.choices.all()
                self.fields['selected_choice'].required = True
                self.fields['text'].widget = forms.HiddenInput()
            else:
                self.fields['selected_choice'].widget = forms.HiddenInput()
                self.fields['text'].required = True



class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ["rating", "review_text"]
        widgets = {
            "rating": forms.HiddenInput(),
            'review_text': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Share your experience...'}),
        }



class EnrollNowForm(forms.ModelForm):
    class Meta:
        model = Enrollment
        fields = []