<?php
   
namespace App\Http\Controllers;
   
use Illuminate\Http\Request;
use Validator;
use App\Models\User;
use App\Models\Address;
use App\Http\Resources\User as UserResource;
   
class UserController extends BaseController
{
    public function index()
    {
        $users = User::with('address','centers.address')->get();
        return $this->sendResponse(UserResource::collection($users), 'Users get.');
    }
    
    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required',
            'email' => 'required'
        ]);
        if($validator->fails()){
            return $this->sendError($validator->errors(),[],500);       
        }
        if (!empty($input['address'])) {
            $input['address_id'] = Address::create($input['address'])->id;
        }
        $input['password'] = bcrypt($input['password'] ?? \Illuminate\Support\Str::random(16));
        $user = User::create($input);
        
        return $this->sendResponse(new UserResource($user), 'Post created.');
    }
   
    public function show($id)
    {
        $user = User::find($id);
        if (is_null($user)) {
            return $this->sendError('Post does not exist.',[],500);
        }
        return $this->sendResponse(new UserResource($user), 'Post fetched.');
    }
    
    public function update(Request $request, User $user)
    {
        
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required',
            'email' => 'required|email'
        ]);
        if($validator->fails()){
            return $this->sendError($validator->errors(),[],500);       
        }

        $address = isset($input['address']['id']) ? Address::find($input['address']['id']) : null;
        if($address){
            $address['city'] = $input['address']['city'];
            $address['number'] = $input['address']['number'];
            $address['street'] = $input['address']['street'];
            $address['zipCode']  =$input['address']['zipCode'];
            $address->save();
        }elseif(!empty($input['address'])){
           $address_id =  Address::create($input['address'])->id;
           $user->address_id = $address_id;
        }

        $user->birthday = $input['birthday'] ?? $user->birthday;
        $user->email = $input['email'];
        $user->name = $input['name'];
        $user->patronymic = $input['patronymic'] ?? $user->patronymic;
        $user->phone = $input['phone'] ?? $user->phone;
        $user->secondName = $input['secondName'] ?? $user->secondName;
        $user->save();
        
        return $this->sendResponse(new UserResource($user->load('address', 'centers')), 'User updated.');
    }
   
    public function destroy(User $user)
    {
        $user->delete();
        return $this->sendResponse([], 'Post deleted.');
    }
}