<h2>Parameters</h2>
<p>The parameters are used if you want to provide the user to use the template as a reference and then just fillout a AWS GUI form. That form would be validated by the parameters file used in the first place.
All the inputs will be validated as per the types specified for each field in the parameters file.</p>

<h3>Parameters can be controlled by</h3>

1. Type: String/ Number/ CommaDelimitedList/ List/ AWS Parameter(AWS Custom Type)
2. Description
3. Contraints 
4. ContraintDescription
5. Min/MaxLength
6. Min/MaxValues 
7. Defaults 
8. AllowedValues(array)
9. AllowedPattern(regex)
10. NoEcho(Boolean) // if set true, the output will not be printed out (used for passwords)